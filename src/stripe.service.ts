import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private readonly stripe: Stripe;

  constructor(private readonly configService: ConfigService) {
    const stripeSecret = this.configService.get<string>('STRIPE_SECRET_KEY')!;
    this.stripe = new Stripe(stripeSecret);
  }

  createPaymentIntent(amount: number) {
    return this.stripe.paymentIntents.create({
      amount,
      currency: 'vnd',
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never',
      },
    });
  }

  constructEventFromPayload(signature: string, payload: Buffer) {
    const webhookSecret = this.configService.get<string>('WEBHOOK_SECRET')!;

    try {
      return this.stripe.webhooks.constructEvent(
        payload,
        signature,
        webhookSecret,
      );
    } catch (err) {
      console.log(err);
      throw new BadRequestException(`Webhook Error`);
    }
  }
}
