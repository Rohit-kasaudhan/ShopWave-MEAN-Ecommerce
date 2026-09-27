/**
 * app.ts — Root Application Component
 *
 * The root component is kept minimal — it only provides the router outlet.
 * All page-level layout is handled within each feature component.
 */

import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  /** Application title — used in browser tab if referenced */
  title = 'ShopWave';
}
