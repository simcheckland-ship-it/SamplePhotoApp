# SamplePhotoApp
Sample Photo App - For Training

## Project Overview & Evolution
The Mission: Built, containerised, and automated a multi-tier web application infrastructure.

## The Growth: 
Evolved the setup from manual Proxmox VMs (Phase 1) to Docker containerisation with GitHub Actions (Phase 2), and finally optimizing it into a decoupled, artifact-based CI/CD pipeline (Phase 3).

## Future Plans
    aunsible → Ansible (Configuration Management / Automation tool)cload-init 
    Cloud-init (Industry-standard multi-distribution drive initialization)easly recreatable sample
    Highly reproducible, immutable infrastructure or automated provisioning template

## Key Takeaways & Engineering Challenges
    Challenge: Overcoming network routing complexities between Proxmox VMs.
    Challenge: Securing and configuring the local self-hosted GitHub runner.
    Optimisation: Why Phase 3 is better than Phase 2 (e.g., smaller image sizes, faster build times, decoupled build/production environments).

```mermaid
graph TD
    %% Define the direction: TD = Top to Bottom (or LR = Left to Right)
    
    Proxmox[Proxmox VE Hypervisor] --> VM0[VM 0: Nginx Reverse Proxy]
    
    VM0 -->|Routes Web Traffic| VM1[VM 1: React Frontend Container]
    VM0 -->|Routes API Calls| VM2[VM 2: Web API Container]
    VM0 -->|Routes Media Requests| VM3[VM 3: Nginx Image Container]
    
    %% Style the nodes to look professional
    style Proxmox fill:#f9f,stroke:#333,stroke-width:2px
    style VM0 fill:#bbf,stroke:#333,stroke-width:2px
```
