import {
  AfterViewInit,
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Output,
  Renderer2,
  ViewChild
} from '@angular/core';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CameraComponent {
  @Output() sendImageData = new EventEmitter<string>();
  @ViewChild('camera') camera!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;

  private readonly renderer: Renderer2 = inject(Renderer2);
  private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

  private stream!: MediaStream;

  public isCameraOpen = false;
  public isPhotoTaken = false;

  public toggleCamera() {
    if (this.isCameraOpen) {
      this.stopCamera();
    } else {
      this.startCamera();
    }
    this.isCameraOpen = !this.isCameraOpen;
    this.cdr.detectChanges();
  }

  private startCamera() {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        this.stream = stream;
        this.renderer.setProperty(this.camera.nativeElement, 'srcObject', stream);
        this.renderer.listen(this.camera.nativeElement, 'loadedmetadata', () => {
        })
      })
      .catch(error => alert('Camera error: ' + error));
  }

  private stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.renderer.setProperty(this.camera.nativeElement, 'srcObject', null);
    }
  }

  public takePhoto() {
    if (!this.isCameraOpen) {
      alert('Camera is not open');
      return;
    }

    const context = this.canvas?.nativeElement.getContext('2d');
    if (!context) {
      alert('Failed to get canvas context');
      return;
    }

    const video = this.camera.nativeElement;
    this.canvas.nativeElement.width = video.videoWidth;
    this.canvas.nativeElement.height = video.videoHeight;

    context.drawImage(video, 0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    const imageDataUrl = this.canvas.nativeElement.toDataURL('image/png');

    this.sendImageData.emit(imageDataUrl.split(',')[1]);
    this.isPhotoTaken = true;
  }
}
