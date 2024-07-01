import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { EventParticipation } from '../../models/event';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit{

  user: User | null = null;
  events: EventParticipation[] = [];
  isAdmin: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private authService: AuthService
  ) { }


  ngOnInit(): void {
    this.authService.isAdmin$.subscribe(isAdmin => {
      this.isAdmin = isAdmin;
    });

    this.route.params.subscribe(params => {
      const userId = params['id'];
      this.loadUserProfile(userId);
      this.loadUserEvents(userId);
    });
  }

  loadUserProfile(userId: number) {
    this.userService.getUserById(userId).subscribe({
      next: response => {
        this.user = response.data;
        this.user.birth_date = this.formatDate(this.user.birth_date)
      },
      error: err => {
        console.error('Error loading user profile', err);
      }
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);

    return `${day}-${month}-${year}`;
  }

  loadUserEvents(userId: number) {
    this.userService.getUserEvents(userId).subscribe({
      next: response => {
        this.events = response.data;
      },
      error: err => {
        console.error('Error loading user events', err);
      }
    });
  }

  removeUserFromEvent(eventId: number) {
    if (this.user) {
      this.userService.removeUserFromEvent(this.user.id, eventId).subscribe({
        next: () => {
          this.loadUserEvents(this.user!.id);
        },
        error: err => {
          console.error('Error removing user from event', err);
        }
      });
    }
  }

}
