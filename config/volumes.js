const PoolsEnum = {
  critical: 'critical',
  niceToHave: 'nice-to-have',
  userData: 'user-data',
}

module.exports = {
  PoolsEnum,
  volumes: {
    [PoolsEnum.critical]: [
      'nginx_data',
      'nginx_config',
      'nextcloud_config',
      'mariadb_data',
      'postgres_data',
      'authentik_media',
      'authentik_certs',
      'authentik_templates',
      'samba_data',
    ],
    [PoolsEnum.niceToHave]: [
      'nginx_letsencrypt',
      'transmission_config',
      'firefly_upload',
      'jellyfin_config',
      'lidarr_config',
      'radarr_config',
      'prowlarr_config',
    ],
    [PoolsEnum.userData]: [
      'nextcloud_data',
    ],
  }
}