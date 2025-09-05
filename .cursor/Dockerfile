# Dockerfile for Situs Background Agents
# Based on Node.js 18 with development tools for full-stack TypeScript project

FROM node:18-bullseye

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    wget \
    vim \
    nano \
    htop \
    postgresql-client \
    build-essential \
    python3 \
    python3-pip \
    && rm -rf /var/lib/apt/lists/*

# Install global Node.js tools
RUN npm install -g \
    @nestjs/cli \
    prisma \
    tsx \
    nodemon \
    pm2 \
    concurrently \
    typescript \
    @types/node

# Create user and set up working directory
RUN useradd -m -s /bin/bash ubuntu && \
    echo 'ubuntu ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers

# Set user and working directory
USER ubuntu
WORKDIR /home/ubuntu

# Set up environment variables
ENV NODE_ENV=development
ENV PATH="/home/ubuntu/.local/bin:$PATH"

# Install additional Python tools for development
RUN pip3 install --user \
    requests \
    beautifulsoup4 \
    selenium

# Create common directories
RUN mkdir -p /home/ubuntu/.vscode-server/extensions \
    && mkdir -p /home/ubuntu/.cursor-server/extensions

# Set up git configuration (will be overridden by agent)
RUN git config --global init.defaultBranch main \
    && git config --global pull.rebase false

# Expose common development ports
EXPOSE 3000 3001 3002 5177 5178 5555 6006

# Default command
CMD ["/bin/bash"]
