# Mistake log

Track implementation mistakes made by the assistant and the prevention step used to avoid repeating them.

| Date | Mistake | Recovery / prevention |
| --- | --- | --- |
| 2026-10-12 | `compileall` initially tried to write bytecode under a macOS Python cache path outside the permitted workspace and reported permission errors. | Re-ran syntax compilation with `PYTHONPYCACHEPREFIX=/tmp/bjw-pycache` so bytecode stays in the writable temporary directory. Set the cache prefix before Python compile checks in this sandbox. |
| 2026-10-12 | Test collection imported the entire FastAPI app for a pure slug helper test, which failed because backend dependencies are not installed in the host environment. | Extracted the pure helper into a dependency-free module and pointed the test at it; keep unit tests narrowly coupled to the code under test. |
| 2026-10-12 | The first pytest command ran without the backend package on `PYTHONPATH`, then exposed use of Python 3.10 union syntax against the host Python 3.9 runtime. | Corrected the import path and changed optional type hints to `typing.Optional` for Python 3.9 compatibility. Keep local test invocations aware of the package root and runtime version. |
| 2026-10-12 | Attempted Docker Compose validation with unsupported `docker compose` flags, then found the installed Docker CLI has no Compose subcommand. | Recorded that container builds and Compose validation cannot be run in this environment; use a host with Docker Compose v2 for end-to-end verification. Check `docker compose version` before running compose commands. |
| 2026-10-12 | Tried to write `frontend/app/admin/imports/page.tsx` before creating `frontend/app/admin/imports/`, so the shell reported “no such file or directory.” | Created the directory and wrote the page again. Create/check target directories before writing nested files; verify expected files with `find` before moving on. |
