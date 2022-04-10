import { UseGuards } from '@nestjs/common';
import { Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';

import { AuthorizationGuard } from 'src/http/auth/authorization.guard';
import { AuthUser, CurrentUser } from 'src/http/auth/current-user';
import { CustomersService } from 'src/services/customers.service';
import { PurchasesService } from 'src/services/purchases.service';

import { Customer } from '../models/customer';
import { Purchase } from '../models/purchase';

@Resolver(() => Customer)
export class CustomersResolver {
  constructor(
    private customerService: CustomersService,
    private purchaseService: PurchasesService,
  ) {}

  @UseGuards(AuthorizationGuard)
  @Query(() => Customer)
  me(@CurrentUser() user: AuthUser) {
    return this.customerService.getCustomerByAuthUserId(user.sub);
  }

  @ResolveField(() => Purchase)
  purchases(@Parent() customer: Customer) {
    return this.purchaseService.listAllFromCustomer(customer.id);
  }
}