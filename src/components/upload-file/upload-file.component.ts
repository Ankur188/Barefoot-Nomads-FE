import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { StaticService } from 'src/services/static.service';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss'],
})
export class UploadFileComponent implements OnInit {
  selectedFile: File | null = null;
  categoryId: string = '';
  imageName: string = '';
  mimeType: string;
  uploadForm: FormGroup;
  trips: any;

  constructor(private http: HttpClient, public staticService: StaticService) {
    this.uploadForm = new FormGroup({
      name: new FormControl(''),
      categoryId: new FormControl(''),
    });
    this.staticService.getTrips().subscribe(data => this.trips = data.trips);
  }

  ngOnInit(): void {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.mimeType = this.selectedFile.type;
  }

  onUpload() {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      this.uploadImage(formData);
    }
  }

  // Function to convert File to base64 format
  convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  }

  // Function to upload image to API
  uploadImage(base64data: FormData) {
    const fileName = this.uploadForm.getRawValue().name
      ? this.uploadForm.getRawValue().name
      : this.uploadForm.getRawValue().categoryId;
    const apiUrl = `${environment.localhost}img/upload`; // Replace with your API endpoint

    base64data.append('categoryId', fileName);

    // Sending POST request with image data
    this.http.post(apiUrl, base64data).subscribe(
      (response) => {
        console.log('Image uploaded successfully:', response);
        // Handle success response
      },
      (error) => {
        console.error('Error uploading image:', error);
        // Handle error response
      }
    );
  }
}
