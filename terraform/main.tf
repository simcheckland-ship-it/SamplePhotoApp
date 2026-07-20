variable "proxmox_endpoint" { type = string }
variable "proxmox_token"    { type = string }
variable "server_inventory" { type = map(any) }

# 1. Declare the incoming SSH Key variable
# variable "ssh_public_key"   { type = string }

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
    # 2. Inject your secure public key into the VM user account
    # user_account {
    #   keys = [var.ssh_public_key]
    #}

    ip_config {
      ipv4 {
        address = each.value.ip_address
        gateway = each.value.gateway
      }
    }
  }
}
