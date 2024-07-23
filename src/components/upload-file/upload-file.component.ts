import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { StaticService } from 'src/services/static.service';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss']
})
export class UploadFileComponent implements OnInit {

  selectedFile: File | null = null;
  categoryId: string ='';
  mimeType: string;

  constructor(private http: HttpClient, public staticService: StaticService) {
    this.staticService.getTrips();
   }

  ngOnInit(): void {
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.mimeType = this.selectedFile.type;
  }

  onUpload() {
    if (this.selectedFile) {
      // Convert selected file to base64 before sending
      // this.convertFileToBase64(this.selectedFile).then((base64: string) => {
      //   console.log(this.selectedFile)
      //   this.uploadImage(base64);
      // });
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
      reader.onerror = error => reject(error);
    });
  }

  // Function to upload image to API
  uploadImage(base64data: FormData) {
    const apiUrl =  `${environment.localhost}img/upload`; // Replace with your API endpoint

    // Headers if needed (adjust accordingly)

    // Body of the POST request
    // const body = {
    //   image: base64data,
    //   categoryId : this.categoryId,
    //   mimetype: this.mimeType
    // };
    base64data.append('categoryId', this.categoryId)

    // Sending POST request with image data
    this.http.post(apiUrl, base64data).subscribe(
      response => {
        console.log('Image uploaded successfully:', response);
        // Handle success response
      },
      error => {
        console.error('Error uploading image:', error);
        // Handle error response
      }
    );
  }

}
