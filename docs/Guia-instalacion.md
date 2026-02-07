# Guía de Instalación Simplificada

Sigue estos pasos para instalar y ejecutar el proyecto **Cifrado César** rápidamente.

## 1. Instalar Herramientas (Solo necesitas esto)

### Paso A: PHP y Composer (Instalador Automático)
Copia y pega el comando en tu terminal para instalar PHP, Composer y Laravel.

- **Windows (PowerShell como Administrador):**
  ```powershell
  Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://php.new/install/windows/8.4'))
  ```

- **macOS:**
  ```bash
  /bin/bash -c "$(curl -fsSL https://php.new/install/mac/8.4)"
  ```

- **Linux:**
  ```bash
  /bin/bash -c "$(curl -fsSL https://php.new/install/linux/8.4)"
  ```
  *(Reinicia tu terminal después de instalar).*

### Paso B: Node.js (Frontend)
- Descarga e instala la versión **LTS** desde [nodejs.org](https://nodejs.org/).

### Paso C: Git
- Descarga e instala **Git** desde [git-scm.com](https://git-scm.com/).

---

## 2. Instalación del Proyecto (Paso a Paso)

Una vez instaladas las herramientas, abre una terminal y ejecuta estos 6 comandos en orden:

### 1. Descargar el código
```bash
git clone <URL_DEL_REPOSITORIO>
cd Cifrado-Cesar-LPYL
```

### 2. Instalar dependencias
```bash
composer install
npm install
```

### 3. Configurar entorno
Duplica el archivo de configuración:
- **Windows:** `copy .env.example .env`
- **Mac/Linux:** `cp .env.example .env`

Genera la clave de aplicación:
```bash
php artisan key:generate
```

### 4. Crear Base de Datos
- **Windows:** `type nul > database/database.sqlite`
- **Mac/Linux:** `touch database/database.sqlite`

### 5. Migraciones (Crear tablas)
```bash
php artisan migrate
```

---

## 3. Ejecutar la Aplicación

Abre **dos terminales** dentro de la carpeta del proyecto y corre este comando:

```bash
composer run dev
```

¡Listo! Abre `http://localhost:8000` en tu navegador.
