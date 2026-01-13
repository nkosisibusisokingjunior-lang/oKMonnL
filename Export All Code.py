import os
import sys
import hashlib
from datetime import datetime

# ----------------------------
# Configuration
# ----------------------------
ROOT_DIR = r"C:\Users\KingJ\Documents\Test site\laureta-scents"
OUTPUT_DIR = r"C:\Users\KingJ\Documents\Test site\laureta-scents_txt_export"

# File extensions to include (expand as needed)
INCLUDE_EXTS = {
    ".js", ".jsx", ".ts", ".tsx",
    ".json", ".mjs", ".cjs",
    ".css", ".scss", ".sass", ".less",
    ".html", ".htm",
    ".md", ".markdown",
    ".yaml", ".yml",
    ".env", ".env.local", ".env.development", ".env.production",
    ".txt",
    ".py",  # in case there are scripts
    ".gitignore", ".gitattributes",
    ".dockerignore", ".dockerfile", ".docker",
    ".babelrc", ".eslintrc", ".prettierrc", ".stylelintrc",
    ".tsconfig", ".postcssrc", ".tailwind.config.js", ".tailwind.config.cjs",
    ".vite.config.js", ".vite.config.ts", ".vite.config.mjs",
    # Note: some tools use extensionless config files; we handle those below
}

# Directories to exclude
EXCLUDE_DIRS = {
    "node_modules", "dist", "build", ".next", ".cache",
    ".git", ".husky", ".turbo", ".vscode", ".idea",
    "coverage", "tmp", "temp", ".pnpm-store"
}

# Max file size in bytes (skip too-large files to avoid noise)
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB

# Treat these extensionless filenames as text configs
INCLUDE_EXTENSIONLESS = {
    "Dockerfile", "Makefile",
    "Procfile",
    "LICENSE",
    "README", "README.md", "README.txt",
    "vite.config", "tailwind.config",
}


# ----------------------------
# Helpers
# ----------------------------
def is_text_candidate(file_path: str) -> bool:
    """Determine if a file should be included based on extension or special name."""
    base = os.path.basename(file_path)
    name, ext = os.path.splitext(base)
    if base in INCLUDE_EXTENSIONLESS:
        return True
    if ext in INCLUDE_EXTS:
        return True
    # Include dotfiles like .env, .gitignore, etc.
    if base.startswith(".") and ext in INCLUDE_EXTS:
        return True
    return False


def is_excluded_dir(dir_name: str) -> bool:
    return dir_name in EXCLUDE_DIRS


def ensure_dir(path: str):
    os.makedirs(path, exist_ok=True)


def read_file_safely(file_path: str) -> str:
    """Read file with best-effort encoding handling."""
    # Try UTF-8 first
    encodings = ["utf-8", "utf-8-sig", "latin-1"]
    for enc in encodings:
        try:
            with open(file_path, "r", encoding=enc, errors="strict") as f:
                return f.read()
        except Exception:
            continue
    # Fallback with replace to avoid breaking on weird bytes
    with open(file_path, "r", encoding="utf-8", errors="replace") as f:
        return f.read()


def normalize_relpath(base: str, full: str) -> str:
    rel = os.path.relpath(full, base)
    # Use forward slashes for consistency across systems
    return rel.replace("\\", "/")


def make_txt_output_path(output_root: str, relpath: str) -> str:
    """
    Map original relative path to a .txt path inside OUTPUT_DIR.
    Example: src/components/Button.tsx -> src/components/Button.tsx.txt
    """
    return os.path.join(output_root, relpath) + ".txt"


def sha256_text(s: str) -> str:
    return hashlib.sha256(s.encode("utf-8")).hexdigest()


# ----------------------------
# Main export logic
# ----------------------------
def export_codebase(root: str, out_root: str):
    ensure_dir(out_root)
    manifest = []
    consolidated_lines = []

    for dirpath, dirnames, filenames in os.walk(root):
        # Prune excluded directories in-place
        dirnames[:] = [d for d in dirnames if not is_excluded_dir(d)]

        for fname in filenames:
            full_path = os.path.join(dirpath, fname)

            # Skip by size
            try:
                size = os.path.getsize(full_path)
            except OSError:
                continue
            if size > MAX_FILE_SIZE:
                continue

            # Include only text-like files
            if not is_text_candidate(full_path):
                continue

            # Read content
            try:
                content = read_file_safely(full_path)
            except Exception:
                # If unreadable, skip
                continue

            rel = normalize_relpath(root, full_path)
            txt_out = make_txt_output_path(out_root, rel)

            # Ensure parent directory exists
            ensure_dir(os.path.dirname(txt_out))

            # Write individual .txt
            header = f"---\nOriginal path: {rel}\nExported: {datetime.utcnow().isoformat()}Z\n---\n"
            try:
                with open(txt_out, "w", encoding="utf-8", newline="\n") as f:
                    f.write(header)
                    f.write(content)
            except Exception:
                continue

            # Update manifest
            manifest.append({
                "relpath": rel,
                "size": size,
                "sha256": sha256_text(content),
                "txt_out": normalize_relpath(out_root, txt_out)
            })

            # Add to consolidated
            consolidated_lines.append(f"\n\n===== FILE: {rel} =====\n")
            consolidated_lines.append(content)

    # Write manifest as JSON
    manifest_path = os.path.join(out_root, "_manifest.json")
    try:
        import json
        with open(manifest_path, "w", encoding="utf-8", newline="\n") as mf:
            json.dump({
                "root": root,
                "output": out_root,
                "exported_count": len(manifest),
                "generated_at": datetime.utcnow().isoformat() + "Z",
                "files": manifest
            }, mf, indent=2)
    except Exception:
        pass

    # Write consolidated single file
    consolidated_path = os.path.join(out_root, "_ALL_FILES_CONSOLIDATED.txt")
    try:
        with open(consolidated_path, "w", encoding="utf-8", newline="\n") as cf:
            cf.write(f"Codebase consolidated export\nRoot: {root}\nGenerated: {datetime.utcnow().isoformat()}Z\n")
            cf.write("\n" + ("=" * 80) + "\n")
            cf.write("Note: Each section begins with '===== FILE: path ====='\n")
            cf.write("\n" + ("=" * 80) + "\n")
            cf.write("".join(consolidated_lines))
    except Exception:
        pass

    print(f"Done. Exported {len(manifest)} files to: {out_root}")
    print(f"- Manifest: {manifest_path}")
    print(f"- Consolidated: {consolidated_path}")


if __name__ == "__main__":
    # Allow optional CLI overrides: python export_codebase.py <root> <out>
    root_arg = ROOT_DIR
    out_arg = OUTPUT_DIR

    if len(sys.argv) >= 2:
        root_arg = sys.argv[1]
    if len(sys.argv) >= 3:
        out_arg = sys.argv[2]

    export_codebase(root_arg, out_arg)