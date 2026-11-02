import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Avatar, AvatarGroup } from 'ashen-ui/avatar';
import { Button } from 'ashen-ui/button';
import { DocExample } from '../../../shared/doc-example/doc-example';
import { DocApi } from '../../../shared/doc-api/doc-api';

@Component({
  selector: 'app-avatar-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'doc-page' },
  imports: [Avatar, AvatarGroup, Button, DocExample, DocApi],
  templateUrl: './avatar-page.html',
  styleUrl: './avatar-page.scss',
})
export class AvatarPage {
  protected readonly team = signal([
    'Ada Lovelace',
    'Grace Hopper',
    'Alan Turing',
    'Katherine Johnson',
    'Edsger Dijkstra',
  ]);

  protected readonly max = signal(3);

  // Deliberately undecodable, so the demo fails the same way offline without a console error.
  protected readonly brokenImage = signal('data:image/png;base64,AAAA');

  protected addMember(): void {
    this.team.update((names) => [...names, `Member ${names.length + 1}`]);
  }

  protected removeMember(): void {
    this.team.update((names) => names.slice(0, -1));
  }

}
