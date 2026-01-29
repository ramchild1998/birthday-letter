import { Component, signal, inject, ElementRef, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeminiService } from './services/gemini.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }
  `]
})
export class AppComponent {
  private geminiService = inject(GeminiService);
  
  // State signals
  isOpen = signal(false);
  isGenerating = signal(false);
  showEditModal = signal(false);
  isPlaying = signal(false);
  
  // DOM References
  audioPlayer = viewChild<ElementRef<HTMLAudioElement>>('audioPlayer');
  fileInput = viewChild<ElementRef<HTMLInputElement>>('fileInput');

  // Content signals (Editable)
  recipientName = signal('Aziza Idana Evalni');
  senderName = signal('Ramadiansyah');
  date = signal('January 30, 2026');
  messageBody = signal('Every year with you is a journey of growth, passion, and shared success. With all my love, always.');
  
  // Photo Signal
  photoUrl = signal('src/assets/IMG_20260129_224508.png');
  
  // Handwriting Effect Signals
  displayedMessage = signal('');
  isWriting = signal(false);
  private typingTimeout: any;

  // Edit Modal State
  editTone = signal('Romantic & Deep');
  editRelationship = signal('My Dearest Love');

  constructor() {
    // Try to load saved photo from local storage
    try {
      const savedPhoto = localStorage.getItem('birthday_photo');
      if (savedPhoto) {
        this.photoUrl.set(savedPhoto);
      }
    } catch (e) {
      console.warn('LocalStorage access denied or failed', e);
    }
  }

  toggleLetter() {
    this.isOpen.update(v => !v);
    
    if (this.isOpen()) {
      this.playMusic();
      // Start handwriting effect
      this.startTyping(this.messageBody());
    } else {
      this.pauseMusic();
      this.stopTyping();
    }
  }

  playMusic() {
    const player = this.audioPlayer()?.nativeElement;
    if (player) {
      player.volume = 0.5;
      player.play().catch(e => console.log("Audio autoplay prevented:", e));
      this.isPlaying.set(true);
    }
  }

  pauseMusic() {
    const player = this.audioPlayer()?.nativeElement;
    if (player) {
      player.pause();
      this.isPlaying.set(false);
    }
  }

  openEditModal(e: Event) {
    e.stopPropagation(); // Prevent closing/opening letter when clicking edit
    this.showEditModal.set(true);
  }

  closeEditModal() {
    this.showEditModal.set(false);
  }

  async generateNewMessage() {
    this.isGenerating.set(true);
    const newMessage = await this.geminiService.generateRomanticMessage(
      this.recipientName(),
      this.editRelationship(),
      this.editTone()
    );
    this.messageBody.set(newMessage.trim());
    this.isGenerating.set(false);
    this.showEditModal.set(false); // Close modal after generation
    
    // Animate the new message if letter is open
    if (this.isOpen()) {
      this.startTyping(this.messageBody());
    }
  }

  triggerFileUpload() {
    this.fileInput()?.nativeElement.click();
  }

  handlePhotoUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          this.photoUrl.set(result);
          // Save to local storage to persist
          try {
            localStorage.setItem('birthday_photo', result);
          } catch (err) {
            console.warn('Could not save photo to local storage (quota exceeded?)', err);
          }
        }
      };
      
      reader.readAsDataURL(file);
    }
  }

  private startTyping(text: string) {
    this.stopTyping(); // Reset current typing
    this.isWriting.set(true);
    
    let i = 0;
    const baseSpeed = 20; // Reduced from 50ms for faster typing

    const type = () => {
      if (i < text.length) {
        this.displayedMessage.update(val => val + text.charAt(i));
        i++;
        // Add random variation to simulate human handwriting
        const variation = Math.random() * 15; // Reduced variation from 40ms
        this.typingTimeout = setTimeout(type, baseSpeed + variation);
      } else {
        this.isWriting.set(false);
      }
    };

    type();
  }

  private stopTyping() {
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
      this.typingTimeout = null;
    }
    this.displayedMessage.set('');
    this.isWriting.set(false);
  }
}