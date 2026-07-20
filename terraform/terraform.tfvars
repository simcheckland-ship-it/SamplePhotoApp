server_inventory = {
  "app-proxy-server" = {
    vm_id      = 120
    cores      = 2
    ram        = 2048
    ip_address = "192.168.0.220/24" # ◄ Your desired static IP and Subnet mask
    gateway    = "192.168.0.1"     # ◄ Your router/gateway IP
  }, 
  "image-server" = {
    vm_id      = 122
    cores      = 2
    ram        = 2048
    ip_address = "192.168.0.222/24" # ◄ Your desired static IP and Subnet mask
    gateway    = "192.168.0.1"     # ◄ Your router/gateway IP
  }
}
