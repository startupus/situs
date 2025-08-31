import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class IntegrationEncryptionService {
  private readonly logger = new Logger(IntegrationEncryptionService.name);
  private readonly algorithm = 'aes-256-gcm';
  private readonly keyLength = 32; // 256 bits

  constructor(private readonly config: ConfigService) {}

  /**
   * Get encryption key from environment or generate a default one
   * In production, this should come from KMS or secure key management
   */
  private getEncryptionKey(): Buffer {
    const keyString = this.config.get<string>('INTEGRATION_ENCRYPTION_KEY') || 
                     this.config.get<string>('JWT_SECRET') || 
                     'default_key_change_in_production_32_chars';
    
    // Create a 32-byte key from the string
    const crypto = require('crypto');
    return crypto.scryptSync(keyString, 'salt', this.keyLength);
  }

  /**
   * Encrypt sensitive data
   */
  encrypt(data: any): string | null {
    if (!data) return null;
    
    try {
      const crypto = require('crypto');
      const key = this.getEncryptionKey();
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipher(this.algorithm, key);
      
      cipher.setAAD(Buffer.from('situs-integration-secrets'));
      
      const plaintext = JSON.stringify(data);
      let encrypted = cipher.update(plaintext, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      
      const authTag = cipher.getAuthTag();
      
      // Combine iv, authTag, and encrypted data
      const combined = iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted;
      return combined;
    } catch (error: any) {
      this.logger.error('Encryption failed:', error?.message || error);
      return null;
    }
  }

  /**
   * Decrypt sensitive data
   */
  decrypt(encryptedData: string): any | null {
    if (!encryptedData) return null;
    
    try {
      const crypto = require('crypto');
      const key = this.getEncryptionKey();
      
      const parts = encryptedData.split(':');
      if (parts.length !== 3) {
        throw new Error('Invalid encrypted data format');
      }
      
      const iv = Buffer.from(parts[0], 'hex');
      const authTag = Buffer.from(parts[1], 'hex');
      const encrypted = parts[2];
      
      const decipher = crypto.createDecipher(this.algorithm, key);
      decipher.setAAD(Buffer.from('situs-integration-secrets'));
      decipher.setAuthTag(authTag);
      
      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      
      return JSON.parse(decrypted);
    } catch (error: any) {
      this.logger.error('Decryption failed:', error?.message || error);
      return null;
    }
  }

  /**
   * Check if data appears to be encrypted
   */
  isEncrypted(data: string): boolean {
    if (!data || typeof data !== 'string') return false;
    // Check for our format: hex:hex:hex
    return /^[a-f0-9]+:[a-f0-9]+:[a-f0-9]+$/.test(data);
  }

  /**
   * Safely handle secrets - encrypt if not already encrypted
   */
  processSecrets(secrets: any): string | null {
    if (!secrets) return null;
    
    if (typeof secrets === 'string' && this.isEncrypted(secrets)) {
      return secrets; // Already encrypted
    }
    
    return this.encrypt(secrets);
  }

  /**
   * Safely retrieve secrets - decrypt if encrypted
   */
  retrieveSecrets(encryptedSecrets: string | null): any {
    if (!encryptedSecrets) return null;
    
    if (this.isEncrypted(encryptedSecrets)) {
      return this.decrypt(encryptedSecrets);
    }
    
    // Not encrypted, return as-is (for backward compatibility)
    try {
      return typeof encryptedSecrets === 'string' ? JSON.parse(encryptedSecrets) : encryptedSecrets;
    } catch {
      return encryptedSecrets;
    }
  }
}