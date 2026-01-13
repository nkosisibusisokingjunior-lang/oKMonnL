import os

def map_folder_structure(root='.', output_file='folder_tree.txt', exclude_dirs=None, show_files=True, max_depth=None):
    if exclude_dirs is None:
        exclude_dirs = {'node_modules', '.git', 'dist', 'build'}

    lines = []

    def walk(path, prefix='', depth=0):
        if max_depth is not None and depth > max_depth:
            return
        try:
            entries = sorted(os.listdir(path))
        except PermissionError:
            lines.append(f"{prefix}[Permission denied] {os.path.basename(path) or path}")
            return
        except FileNotFoundError:
            return

        dirs = [e for e in entries if os.path.isdir(os.path.join(path, e))]
        files = [e for e in entries if os.path.isfile(os.path.join(path, e))]

        for i, d in enumerate(dirs):
            if d in exclude_dirs:
                continue
            connector = "└─ " if i == len(dirs) - 1 and not (show_files and files) else "├─ "
            lines.append(f"{prefix}{connector}{d}/")
            next_prefix = prefix + ("   " if connector == "└─ " else "│  ")
            walk(os.path.join(path, d), next_prefix, depth + 1)

        if show_files:
            for j, f in enumerate(files):
                connector = "└─ " if j == len(files) - 1 else "├─ "
                lines.append(f"{prefix}{connector}{f}")

    root_name = os.path.basename(os.path.abspath(root)) or root
    lines.append(f"{root_name}/")
    walk(root, prefix='')

    with open(output_file, 'w', encoding='utf-8') as out:
        out.write("\n".join(lines))

    print(f"Folder structure saved to {output_file}")

if __name__ == "__main__":
    # Example usage: adjust arguments as needed
    map_folder_structure(root='.', output_file='folder_tree.txt', exclude_dirs={'node_modules', '.git'}, show_files=True, max_depth=None)