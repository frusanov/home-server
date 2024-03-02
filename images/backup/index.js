const { CommandBuilder } = require('../../lib/command-builder');
const { PoolsEnum } = require('../../config/volumes');

const commandBuilder =
  new CommandBuilder('docker run --rm -it')
    .setName('backup')
    .setImage('backup:local')
    // /mnt/volumes/critical/*
    .addVolumesPool(PoolsEnum.critical)
    // /mnt/volumes/nice-to-have/*
    .addVolumesPool(PoolsEnum.niceToHave)
    // /mnt/volumes/user-data/*
    .addVolumesPool(PoolsEnum.userData);

process.stdout.write(commandBuilder.buildCommand());