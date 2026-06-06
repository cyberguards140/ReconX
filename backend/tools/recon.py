def build_recon_commands(target: str, options: dict = None):
    """
    Builds a list of commands for the Recon cluster.
    """
    if options is None:
        options = {}
        
    commands = [
        {
            "name": "nmap",
            "cmd": f"nmap -sV -sC -T4 -p- --open {target}"
        },
        {
            "name": "subfinder",
            "cmd": f"subfinder -d {target} -all -silent"
        }
    ]
    
    return commands
