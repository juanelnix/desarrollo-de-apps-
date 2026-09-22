# Pasos manuales que la guía pide (no se pueden generar como archivo)

## 1. Instalar dependencias (Paso 1 de la guía)
Tu `package.json` YA tiene `@capacitor/camera` y `@ionic/pwa-elements`, así que solo corre:

```bash
npm install
npx cap sync
```

## 2. Reemplaza en tu proyecto
- `src/main.ts` → reemplázalo por el de este paquete
- `src/app/app.routes.ts` → reemplázalo (ahora enruta a `gallery`, no a `home`)
- `src/app/app.component.ts` y `.html` → sin cambios, pero incluidos por si acaso
- **Borra** `src/app/app.config.ts` — la guía mueve los `providers` directo a `main.ts`, ya no se usa
- **Borra** la carpeta `src/app/home/` (home.page.ts/.html/.scss) — la guía reemplaza esa página por `gallery.page.ts`
- Agrega las carpetas nuevas:
  - `src/app/models/photo.model.ts`
  - `src/app/services/photo.service.ts`
  - `src/app/gallery/gallery.page.ts`

## 3. Permisos nativos (Paso 3 de la guía)
Estos archivos solo existen **después** de correr `npx cap add android` / `npx cap add ios`, así que no puedo generarlos por ti sin ver esas carpetas. Cuando las tengas, agrega:

### Android — `android/app/src/main/AndroidManifest.xml`
Dentro de `<manifest>`:
```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" android:maxSdkVersion="32" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" android:maxSdkVersion="29" />
<uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />
```

### iOS — `ios/App/App/Info.plist`
Dentro de `<dict>`:
```xml
<key>NSCameraUsageDescription</key>
<string>Necesitamos acceso a la cámara para capturar fotografías de inspección.</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>Necesitamos acceso a su biblioteca para adjuntar fotos existentes.</string>
<key>NSPhotoLibraryAddUsageDescription</key>
<string>Necesitamos permiso para guardar fotos tomadas en su carrete.</string>
```

## 4. Probar
```bash
ionic serve                       # navegador (usa @ionic/pwa-elements)
ionic cap run android -l --external   # dispositivo/emulador Android
```
