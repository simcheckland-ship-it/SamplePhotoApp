name: "Proxmox Terraform Deploy"

on:
  push:
    branches: [ "main" ]

jobs:
  terraform:
    name: "Run Terraform"
    runs-on: self-hosted

    # ◄ Tells the runner to jump into your terraform folder first
    defaults:
      run:
        working-directory: ./terraform

    steps:
    - name: Checkout Code
      uses: actions/checkout@v4

    - name: Terraform Init
      run: terraform init

    - name: Terraform Plan
      run: terraform plan

    - name: Terraform Apply
      run: terraform apply -auto-approve

