provider "oci" {
  tenancy_ocid     = var.tenancy_ocid
  user_ocid        = var.user_ocid
  fingerprint      = var.fingerprint
  private_key_path = var.private_key_path
  region           = var.region
}

resource "oci_core_instance" "generated_oci_core_instance" {
	agent_config {
		is_management_disabled = "false"
		is_monitoring_disabled = "false"
		plugins_config {
			desired_state = "DISABLED"
			name = "Vulnerability Scanning"
		}
		plugins_config {
			desired_state = "DISABLED"
			name = "OS Management Hub Agent"
		}
		plugins_config {
			desired_state = "DISABLED"
			name = "Management Agent"
		}
		plugins_config {
			desired_state = "ENABLED"
			name = "Custom Logs Monitoring"
		}
		plugins_config {
			desired_state = "DISABLED"
			name = "Compute RDMA GPU Monitoring"
		}
		plugins_config {
			desired_state = "ENABLED"
			name = "Compute Instance Monitoring"
		}
		plugins_config {
			desired_state = "DISABLED"
			name = "Compute HPC RDMA Auto-Configuration"
		}
		plugins_config {
			desired_state = "DISABLED"
			name = "Compute HPC RDMA Authentication"
		}
		plugins_config {
			desired_state = "ENABLED"
			name = "Cloud Guard Workload Protection"
		}
		plugins_config {
			desired_state = "DISABLED"
			name = "Block Volume Management"
		}
		plugins_config {
			desired_state = "DISABLED"
			name = "Bastion"
		}
	}
	availability_config {
		recovery_action = "RESTORE_INSTANCE"
	}
	availability_domain = "njPf:AP-MUMBAI-1-AD-1"
	compartment_id = "ocid1.tenancy.oc1..aaaaaaaacvznm7m5howrbi4gfyz6nwehf7fdj7dt2xvxeeptv2msjtu3lqaq"
	create_vnic_details {
		assign_ipv6ip = "false"
		assign_private_dns_record = "true"
		assign_public_ip = "true"
		display_name = "DKGL-VCIN2"
		subnet_id = "ocid1.subnet.oc1.ap-mumbai-1.aaaaaaaadlhld6jnwri4dnhebgcjc3h2k66eeboznjrjsp2yur4h4qclqfla"
	}
	display_name = "DKGL-INSTANCE2"
	instance_options {
		are_legacy_imds_endpoints_disabled = "true"
	}
	is_pv_encryption_in_transit_enabled = "true"
	metadata = {
		"ssh_authorized_keys" = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDS3woAC73qcl/M9HS3GR0a6f9zpjcb0NUQP8+beOi4ABFGjPAE5li9lWykIdVb4SKsnUJD91/oXDO8LJj4gBWq63hwTsa1t11LuUIRYG1wrpIUrZtzejJGnVm51qtSguGpPXsq1+udc+zm27iTHIeFwp8KMfsh4TlNQLA6KyTCJTO9Mqm9i3xFZlxetJex3vw1gycNLmJ+Velku8MgM/XYaLERAOMkNV0lIlNVCeI8eWegykwz8EH+nwMyUH4jllP9TJ9RV4Sww7qmXz9fGPqCneULwDdY1z4Rh/nLunGn2yy3am59DIbSu65/C2haJ9D2ghjLa0WPFLDz2vNX70Tb ssh-key-2026-06-28"
	}
	shape = "VM.Standard.A1.Flex"
	shape_config {
		memory_in_gbs = "12"
		ocpus = "2"
	}
	source_details {
		boot_volume_size_in_gbs = "50"
		boot_volume_vpus_per_gb = "10"
		source_id = "ocid1.image.oc1.ap-mumbai-1.aaaaaaaaadmdg6ba7uxnieefn7cxfik4ouqsbk4mpvm45vpmdkpa7ozgpjuq"
		source_type = "image"
	}
}

output "instance_public_ip" {
  value = oci_core_instance.generated_oci_core_instance.public_ip
}
