"""Post-build optimisation for dist/: minify CSS and JS with esbuild when it's available (set ESBUILD=/path/to/esbuild
or have it on PATH). Sources in src/ stay readable. Safe to skip: the site works unminified."""
import os, shutil, subprocess, pathlib
DIST = pathlib.Path(__file__).resolve().parent.parent / "dist" / "assets"
def run():
    eb = os.environ.get("ESBUILD") or shutil.which("esbuild")
    if not eb: print("optimize: esbuild not found, skipping minify"); return
    saved = 0
    for f in list(DIST.glob("*.css")) + list(DIST.glob("*.js")):
        before = f.stat().st_size
        args = [eb, str(f), "--minify", f"--outfile={f}", "--allow-overwrite", "--log-level=error"]
        if f.suffix == ".js": args.append("--target=es2019")
        subprocess.run(args, check=True); saved += before - f.stat().st_size
    print(f"optimize: minified CSS/JS, saved {saved//1024} KB")
if __name__ == "__main__": run()
