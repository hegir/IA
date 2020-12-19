import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { RolesService } from '../../../services/roles.service';
import { Role } from '../../../models/role';
import { NotificationsService } from '../../../core/notifications.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  providers: [RolesService]
})

export class RolesComponent implements OnInit {
  roles: Role[] = new Array();

  constructor(private router: Router, private rolesService: RolesService, private notificationsService: NotificationsService) {
    this.rolesService.Find().then(x => {
      if (x != null) {
        this.roles = x.sort((a, b) => {
          return (a.Id.localeCompare(b.Id, environment.defaultLanguage))
        })
      }
    })

  }

  ngOnInit() { }

  editRole(id: string) {
    this.router.navigate(['roles/', id])
  }

}
