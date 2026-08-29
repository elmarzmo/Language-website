import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Navbar } from '../../component/navbar/navbar';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterLink],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements OnInit {
  @ViewChild('howItWorks', { static: false }) howItWorks?: ElementRef;
  
  currentYear: number = new Date().getFullYear();

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.initializeAnimations();
  }

  navigateToSignup(): void {
     this.router.navigate(['/signin'], { queryParams: { action: 'signup' } });
  }

  navigateToSignIn(): void {
    this.router.navigate(['/signin']);
  }

  navigateToHome(): void {
    this.router.navigate(['/home']);
  }
  scrollToHowItWorks(): void {
    if (this.howItWorks) {
      this.howItWorks.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

  private initializeAnimations(): void {
    if ('IntersectionObserver' in window) {
      const observerOptions: IntersectionObserverInit = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
          }
        });
      }, observerOptions);

      document.querySelectorAll('.fade-in-on-scroll').forEach((element) => {
        observer.observe(element);
      });
    }
  }

  // Value propositions for "Why Voixa" section
  valuePropositions = [
    {
      icon: 'ti-user-check',
      title: 'Native-Speaking Teachers',
      description: 'Learn from teachers who speak English naturally and help you develop real-world communication skills.'
    },
    {
      icon: 'ti-users-group',
      title: 'Small Group Classes',
      description: 'Get more opportunities to speak, participate, and interact with your classmates.'
    },
    {
      icon: 'ti-message-circle-2',
      title: 'Real-World English',
      description: 'Practice English you can actually use in everyday conversations and situations.'
    }
  ];

  // Steps for "How it Works" section
  steps = [
    {
      number: 1,
      title: 'Create Your Account',
      description: 'Sign up and create your student profile.'
    },
    {
      number: 2,
      title: 'Join Your Class',
      description: 'Attend your scheduled small-group class with a native-speaking teacher.'
    },
    {
      number: 3,
      title: 'Practice & Improve',
      description: 'Build your speaking, listening, vocabulary, and communication skills through structured lessons and conversation practice.'
    }
  ];

  // Example topics for the "Lessons" section
  exampleLessons = [
    'Making a dentist appointment',
    'Introducing yourself at a professional event',
    'Talking about your home and living situation',
    'Expressing feelings and opinions naturally',
    'Everyday small talk and greetings',
    'Asking questions and getting clarification',
    'Responding naturally in conversations'
  ];

  // Benefits for the "Teachers" section
  benefits = [
    {
      icon: 'ti-volume-2',
      title: 'Speak with more confidence',
      description: 'Practice speaking in a supportive environment and build confidence with every class.'
    },
    {
      icon: 'ti-headphones',
      title: 'Improve listening comprehension',
      description: 'Train your ear to understand native-speaking teachers and everyday English conversations.'
    },
    {
      icon: 'ti-book',
      title: 'Expand everyday vocabulary',
      description: 'Learn words and phrases you\'ll actually use in real-life situations.'
    },
    {
      icon: 'ti-users',
      title: 'Practice natural conversations',
      description: 'Engage in realistic dialogues with teachers and classmates.'
    }
  ];
}