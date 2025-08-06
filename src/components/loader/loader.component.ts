import { Component, OnInit } from '@angular/core';
import { LoadingService } from 'src/services/loading.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {

  constructor(private loaderService: LoadingService) { }
  isLoading$ = this.loaderService.loading$;

  ngOnInit(): void {
  }

}
