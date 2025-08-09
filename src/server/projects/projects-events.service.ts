import { Injectable } from '@nestjs/common';
import { Subject, Observable } from 'rxjs';

export interface ProjectEvent {
  type: 'project_status';
  payload: { id: string; status: string };
}

@Injectable()
export class ProjectsEventsService {
  private readonly subject = new Subject<MessageEvent<ProjectEvent>>();

  asObservable(): Observable<MessageEvent<ProjectEvent>> {
    return this.subject.asObservable();
  }

  emitStatus(id: string, status: string): void {
    const event: ProjectEvent = { type: 'project_status', payload: { id, status } };
    // серверный лог
    try { console.log('[SSE] project_status', { id, status, at: new Date().toISOString() }); } catch {}
    this.subject.next({ data: event } as MessageEvent<ProjectEvent>);
  }
}


