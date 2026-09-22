import { Injectable, signal } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { UserPhoto } from '../models/photo.model';

@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  // 1. Estado reactivo privado mediante Angular Signals
  private photosSignal = signal<UserPhoto[]>([]);

  // 2. Exposición de solo lectura del estado para los componentes
  public readonly photos = this.photosSignal.asReadonly();

  /**
   * Captura una foto permitiendo al usuario elegir origen y calidad.
   * @param isHighDef Define si la imagen se procesa en alta calidad o ahorro de datos.
   * @returns boolean true si la foto fue tomada, false si hubo error o permiso denegado.
   */
  async takeNewPhoto(
    isHighDef: boolean,
  ): Promise<{ success: boolean; reason?: 'permission_denied' | 'cancelled' | 'error' }> {
    try {
      // 1. Verificación y solicitud de permisos para cámara y fotos
      const checkStatus = await Camera.checkPermissions();
      if (checkStatus.camera !== 'granted' || checkStatus.photos !== 'granted') {
        const request = await Camera.requestPermissions({ permissions: ['camera', 'photos'] });
        if (request.camera !== 'granted' && request.photos !== 'granted') {
          console.warn('Permisos de cámara o galería no concedidos.');
          return { success: false, reason: 'permission_denied' };
        }
      }

      // 2. Parámetros dinámicos según el modo seleccionado
      const imageQuality = isHighDef ? 95 : 60;
      const targetWidth = isHighDef ? 1920 : 800;

      // 3. Captura con CameraSource.Prompt (Diálogo nativo: Cámara o Carrete)
      const capturedPhoto: Photo = await Camera.getPhoto({
        resultType: CameraResultType.Uri,
        source: CameraSource.Prompt, // Permite al usuario elegir entre cámara o galería
        quality: imageQuality,
        width: targetWidth,
        allowEditing: false,
        promptLabelHeader: 'Seleccionar Origen',
        promptLabelPhoto: 'Elegir de la Galería',
        promptLabelPicture: 'Tomar Fotografía',
      });

      // 4. Mapeo y actualización inmutable
      const newPhoto: UserPhoto = {
        filepath: `${Date.now()}.${capturedPhoto.format}`,
        webPath: capturedPhoto.webPath,
        format: capturedPhoto.format,
      };

      this.photosSignal.update((photos) => [newPhoto, ...photos]);
      return { success: true };
    } catch (error: any) {
      if (error?.message?.includes('cancelled') || error?.message?.includes('User cancelled')) {
        return { success: false, reason: 'cancelled' };
      }
      console.error('Error durante la captura:', error);
      return { success: false, reason: 'error' };
    }
  }

  // 9. Método para eliminar una imagen del estado
  deletePhoto(index: number): void {
    this.photosSignal.update((photos) => photos.filter((_, i) => i !== index));
  }
}
