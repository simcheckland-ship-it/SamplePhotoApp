
terraform {
  required_providers {
    proxmox = {
      source  = "bpg/proxmox"
      version = "0.66.0"
    }
  }

  # anchor state memory safely outside GitHub's workspace
  backend "local" {
    path = "/var/lib/terraform/proxmox-infra.tfstate"
  }
}

variable "proxmox_endpoint" { type = string }
variable "proxmox_token"    { type = string }
variable "server_inventory" { type = map(any) }
variable "server_passwords" { 
  type    = map(string)
  default = {}
}


provider "proxmox" {
  endpoint  = var.proxmox_endpoint
  api_token = var.proxmox_token
  insecure  = true
}

resource "proxmox_virtual_environment_vm" "docker_hosts" {
  for_each = var.server_inventory

  name        = each.key
  node_name   = "pve"
  vm_id       = each.value.vm_id

  clone {
    vm_id = 9000
  }

  cpu { cores = each.value.cores }
  memory { dedicated = each.value.ram }
  network_device { bridge = "vmbr0" }

  initialization {
    # Inject your secure public key into the VM user account
    user_account {
      username = each.value.username
      keys     =  flatten([each.value.ssh_keys])
      password = var.server_passwords[each.key] # Pulls from your deploy.yml JSON map
    }

    ip_config {
      ipv4 {
        address = each.value.ip_address
        gateway = each.value.gateway
      }
    }
  }
}

resource "local_file" "ansible_inventory" {
  # Targets the directory where your GitHub runner calls ansible-playbook
  filename = "${path.module}/../ansible/inventory.ini"
  
  content = <<EOT
%{ for server_key, server_data in var.server_inventory ~}
[${server_key}]
${split("/", server_data.ip_address)[0]} ansible_user=${server_data.username}

%{ endfor ~}
EOT

  # Ensures the inventory file is rewritten anytime a VM resource changes
  depends_on = [proxmox_virtual_environment_vm.docker_hosts]
}
