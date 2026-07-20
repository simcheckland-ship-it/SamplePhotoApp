terraform {
  required_providers {
    proxmox = {
      source  = "bpg/proxmox"
      version = "0.66.0"
    }
  }
}

variable "proxmox_endpoint" { type = string }
variable "proxmox_token"    { type = string }

# 1. Connect to your Proxmox Server API
provider "proxmox" {
  endpoint  = var.proxmox_endpoint
  api_token = var.proxmox_token
  insecure  = true
}

# 2. Clone the Golden Image Template (ID 9000) from your SSD pool
resource "proxmox_virtual_environment_vm" "docker_host_vm" {
  name        = "automated-docker-host"
  description = "Provisioned via GitHub Actions and Terraform"
  node_name   = "pve"
  vm_id       = 101 # The target ID for your brand-new virtual machine

  # Point to your locked-down template VM
  clone {
    vm_id = 9000
  }

  cpu {
    cores = 2
  }

  memory {
    dedicated = 2048
  }

  network_device {
    bridge = "vmbr0"
  }

  # Dynamically trigger DHCP via Cloud-Init on first boot
  initialization {
    ip_config {
      ipv4 {
        address = "dhcp"
      }
    }
  }
}
