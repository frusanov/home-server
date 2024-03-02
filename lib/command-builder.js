const { volumes, PoolsEnum } = require('../config/volumes');

class CommandBuilder {
  constructor(baseCommand) {
    this.baseCommand = baseCommand;
    this.volumes = [];
    this.containerName = null;
    this.imageName = null;
  };

  setName(name) {
    this.containerName = name;
    return this;
  }

  setImage(name) {
    this.imageName = name;
    return this;
  }

  _buildNameString() {
    return this.containerName ? `  --name ${this.containerName}` : null;
  }

  _buildImageString() {
    if (!this.imageName) throw new Error('Image name is required');
    return `  ${this.imageName}`;
  }

  addVolume(volume, pool = 'other') {
    this.volumes.push([volume, pool]);
    return this;
  }

  addVolumesToPool(pool, volumes) {
    volumes.forEach(volume => this.addVolume(volume, pool));
    return this;
  }

  addVolumesPool(pool) {
    if (!volumes[pool]) throw new Error(`Pool ${pool} does not exist`);
    this.addVolumesToPool(pool, volumes[pool]);
    return this;
  }

  _buildVolumesString() {
    return this.volumes.map(volume => {
      return `  -v ${volume[0]}:/mnt/volumes/${volume[1]}/${volume[0]}`;
    }).join(' \\\n');
  }

  buildCommand() {
    const command = [
      this.baseCommand,
      this._buildVolumesString(),
      this._buildNameString(),
      this._buildImageString(),
    ].filter(Boolean);

    return command.join(' \\\n');
  }
}

module.exports = {
  CommandBuilder,
};