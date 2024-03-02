### Give the scripts rights to execute

```bash
chmod +x build
chmod +x run
```

### Run the build script

```bash
./build
```

### Setup rclone  
You will need use another machine that can run rclone web-server to get the token.

```bash
./run rclone config
```

### Init restic

```bash 
 ./run restic -r rclone:gdrive:restic-backups/home-server init
```