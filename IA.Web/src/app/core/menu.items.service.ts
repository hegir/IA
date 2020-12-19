import { Injectable } from '@angular/core';


export interface BadgeItem {
  type: string;
  value: string;
}
export interface Saperator {
  name: string;
  type?: string;
}
export interface ChildrenItems {
  state: string;
  name: string;
  type?: string;
  permission?: string;
}

export interface Menu {
  state: string;
  name: string;
  type: string;
  icon: string;
  permission?: string;
  badge?: BadgeItem[];
  saperator?: Saperator[];
  children?: ChildrenItems[];
}

const MENUITEMS: Menu[] = [

  {
    state: 'dashboard',
    name: 'DASHBOARD',
    type: 'link',
    icon: 'av_timer',
    permission: 'P_DASHBOARD_VIEW'
  },

  {
    state: 'settings',
    name: 'SETTINGS',
    type: 'sub',
    icon: 'library_books',
    children:
      [
        {
          state: 'insurancetypes',
          name: 'INSURANCETYPES',
          type: 'link',
          permission: 'P_INSURANCE_TYPES_VIEW'
        },
        {
          state: 'cities',
          name: 'CITIES',
          type: 'link',
          permission: 'P_CITIES_VIEW'
        },
        { state: 'roles', name: 'ROLES', type: 'link', permission: 'P_ROLES_VIEW' },
        { state: 'companies', name: 'COMPANIES', type: 'link', permission: 'P_COMPANIES_VIEW' },
        {
          state: 'mainoffices',
          name: 'MAINOFFICES',
          type: 'link',
          permission: 'P_MAIN_OFFICES_VIEW'
        },
        {
          state: 'users',
          name: 'USERS',
          type: 'link',
          permission: 'P_USERS_VIEW'
        },
        {
          state: 'insurancecompanies',
          name: 'INSURANCECOMPANIES',
          permission: 'P_INSURANCES_VIEW',
          type: 'link'
        },
        {
          state: 'contractedcomissions',
          name: 'CONTRACTED_COMISSION',
          permission: 'P_CONTRACTED_COMISSION_VIEW',
          type: 'link'
        },
        {
          state: 'colors',
          name: 'COLORS_OF_VEHICLE',
          permission: 'P_COLORS_VIEW',
          type: 'link'
        },
        {
          state: 'technicalinspections',
          name: 'TECHNICAL_INSPECTIONS',
          permission: 'P_TECHNICAL_INSPECTION_VIEW',
          type: 'link'
        },
        {
          state: 'partners',
          name: 'PARTNERS',
          permission: 'P_PARTNERS_VIEW',
          type: 'link'
        }
      ]
  },
  {
    state: 'policysettings',
    name: 'POLICY_SETTINGS',
    type: 'sub',
    icon: 'settings',
    children:
      [
        {
          state: 'policynumbers',
          name: 'POLICY_NUMBERS',
          permission: 'P_POLICY_NUMBERS_VIEW',
          type: 'link'
        },{
          state: 'obligatepolicynumbers',
          name: 'OBLIGATE_POLICY_NUMBERS',
          permission: 'P_POLICY_NUMBERS_VIEW',
          type: 'link'
        },
        {
          state : 'discharged',
          name : 'DISCHARGE_POLICY_NUMBERS',
          permission : 'P_POLICY_NUMBERS_ADMIN_DISCHARGED',
          type: 'link'
        }
      ]
  },
  {
    state : 'policynumbersagent',
    name : 'POLICY_SETTINGS',
    type : 'sub',
    icon : 'settings',
    permission : 'P_POLICY_NUMBERS_AGENT_VIEW',
    children:
    [
      {
        state : 'obligateagentspolicynumbers',
        name : 'OBLIGATE_POLICY_NUMBERS',
        permission : 'P_AGENT_OBLIGATE_POLICY_NUMBERS',
        type: 'link'
      },
      {
        state : 'returnagentspolicynumbers',
        name : 'RETURN_POLICY_NUMBERS',
        permission : 'P_AGENT_RETURN_POLICY_NUMBERS',
        type: 'link'
      },
    ]
  },
  {
    state : 'greencardsettings',
    name: 'GREEN_CARDS',
    type : 'sub',
    icon : 'credit_card',
    children :
    [
      {
        state : 'greencards',
        name: 'GREEN_CARDS_INPUT',
        permission: 'P_GREEN_CARDS_VIEW',
        type: 'link'
      },
      {
        state : 'obligategreencards',
        name : 'OBLIGATE_GREEN_CARDS',
        permission: 'P_GREEN_CARDS_VIEW',
        type : 'link'
      }
    ]
  },
  {
    state: 'voucherssettings',
    name: 'VOUCHER_SETTINGS',
    type: 'sub',
    icon: 'redeem',
    children:
      [
        { state: 'vouchers',
        name: 'VOUCHER_INPUT',
        type: 'link',
        permission: 'P_VOUCHERS_VIEW' },
        {
          state: 'obligatevouchers',
          name: 'OBLIGATE_VOUCHERS',
          type: 'link',
          permission: 'P_VOUCHERS_VIEW'
        }
      ],
  },
  {
    state: 'policies',
    name: 'POLICIES',
    icon: 'book',
    permission: 'P_POLICIES_VIEW',
    type: 'link'
  },
  {
    state: 'policyholders',
    name: 'POLICYHOLDERS',
    type: 'link',
    icon: 'account_box',
    permission: 'P_POLICY_HOLDERS_VIEW'
  },
  {
    state: 'reports',
    name: 'REPORTS',
    type: 'sub',
    icon: 'reports',
    children:
      [
        { state: 'specifications',
        name: 'SPECIFICATIONS',
        type: 'link',
        permission: 'P_SPECIFICATIONS_VIEW' },
        {
          state: 'premium',
        name: 'PREMIUM',
        type: 'link',
        permission: 'P_PREMIUM_VIEW'
      },
      {
        state : 'skadenca',
        name : 'SKADENCA',
        type : 'link',
        permission : 'P_SKADENCA_VIEW'
      },
      {
        state : 'obligateddischarged',
        name : 'OBLIGATED_DISCHARGED_POLICY_NUMBERS',
        permission : 'P_OBLIGATED_DISCHARGED_REPORT_VIEW',
        type : 'link'
      },
      {
        state : 'obligateddischargedadmin',
        name : 'POLICY_NUMBER_STATUS_REPORT',
        permission : 'P_ADMIN_OBLIGED_DISCHARGED_REPORT_VIEW',
        type : 'link'
      },
      {
        state : 'premiumanalysis',
        name : "PREMIUM_ANALYSIS_REPORT",
        permission : "P_PREMIUM_ANALYSIS_REPORT_VIEW",
        type : 'link'
      }
      ],
  }
];

import { TokenStorage } from './tokenstorage.service';
import { NgxPermissionsService } from 'ngx-permissions'

@Injectable()
export class MenuItemsService {
  constructor(
    private tokenStorage: TokenStorage,
    private permissionService: NgxPermissionsService
  ) { }

  getMenuItems(): Menu[] {
    let menuItems: Menu[] = new Array();
    let permissions = this.tokenStorage.getUserPermissions();
    this.permissionService.loadPermissions(permissions);
    MENUITEMS.forEach(route => {
      if (route.permission == null) {
        let menuItem: any = <Menu>JSON.parse(JSON.stringify(route))
        if (route.children != null) {
          menuItem.children = new Array();
          route.children.forEach(child => {
            if (child.permission != null) {
              let perm = permissions.find(x => x == child.permission)
              if (perm != null) {
                menuItem.children.push(child);
              }
            }
            else {
              menuItem.children.push(child);
            }
          });
          if (menuItem.children.length > 0) {
            menuItems.push(menuItem);
          }
        }
        else {
          menuItems.push(route);
        }
      }
      else {
        let perm = permissions.find(x => x == route.permission)
        if (perm != null) {
          menuItems.push(route);
        }
      }
    });
    return menuItems;
  }
}
