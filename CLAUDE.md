# CLAUDE.md — SMS Masivos WooCommerce Plugin

Guía de trabajo para este repositorio. Aplica tanto para desarrollo humano como para asistencia con Claude Code.

## Descripción del proyecto

Plugin de WordPress/WooCommerce que integra envío de SMS y WhatsApp a través de la plataforma SMS Masivos. Notifica automáticamente a los clientes cuando cambia el estado de sus órdenes.

- **Repositorio**: `SMS-Masivos/woocommerce-plugin` (público)
- **Archivo principal**: `sms-masivos.php`
- **Update checker**: `plugin-update-checker-master/` (YahnisElsts) — consume GitHub Releases API

## Flujo de trabajo con ramas

```
master          ← única rama de producción, solo recibe merges
  └── feature/* ← todo el trabajo se hace aquí
```

1. Crear rama desde `master`: `git checkout -b feature/descripcion`
2. Hacer los cambios en la feature branch
3. Merge a `master` con `--no-ff`: `git merge feature/descripcion --no-ff`
4. Crear tag y push: `git tag vX.Y.Z && git push origin master --tags`
5. GitHub Actions crea el release automáticamente

**Nunca commitear directamente a `master`.**

## Versionamiento

Se usa **SemVer** (`MAJOR.MINOR.PATCH`) con prefijo `v`. Ejemplo: `v6.0.3`

- `PATCH` — correcciones, ajustes menores
- `MINOR` — funcionalidad nueva compatible
- `MAJOR` — cambios que rompen compatibilidad

### Al crear una nueva versión, actualizar:

| Archivo | Campo |
|---|---|
| `sms-masivos.php` | `* Version: X.Y.Z` |
| `readme.txt` | `Stable tag: X.Y.Z` |
| `readme.txt` | Agregar entrada en `== Changelog ==` |

## Releases automáticos (GitHub Actions)

El workflow `.github/workflows/release.yml` se dispara al hacer push de un tag `v*`.

**Qué genera:**
- `.zip` con el nombre `sms-masivos-X.Y.Z.zip`
- Carpeta raíz dentro del zip: `sms-masivos/`
- GitHub Release con el zip adjunto y notas automáticas

**Archivos excluidos del zip:**
- `.git/`, `.github/`, `.gitignore`
- `README.md`, `context-*.md`
- `.DS_Store`, `.gitlab-ci.yml`

## Convenciones de commits

Usar prefijos semánticos en español o inglés:

```
feat:    nueva funcionalidad
fix:     corrección de bug
chore:   tareas de mantenimiento (versión, dependencias)
docs:    solo documentación
refactor: refactorización sin cambio funcional
```

Ejemplos:
```
feat: agregar soporte para notificaciones de reembolso
fix: corregir envío duplicado en órdenes completadas
chore: actualizar versión a 6.1.0
```

## Estructura del proyecto

```
sms-masivos.php              # Archivo principal, headers del plugin
readme.txt                   # Formato WordPress.org (changelog, FAQ)
assets/
  css/                       # Estilos del panel admin
  js/                        # Scripts front-end y admin
class/
  sms-generals.php           # Clase principal de lógica
  sms-activate.php           # Hooks de activación/desactivación
  ...
templates/                   # Vistas HTML del panel admin
plugin-update-checker-master/ # Librería de actualizaciones (no modificar)
.github/workflows/
  release.yml                # Pipeline de release automático
```

## Lo que NO va en este repositorio

- Credenciales de API, tokens, passwords
- Archivos `.env`
- Archivos de contexto de desarrollo (`context-*.md` ya están en `.gitignore`)
- Información interna de infraestructura SMS Masivos
