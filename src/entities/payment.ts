export class Payment {
  public id?: number;
  public payer_id: number;
  public payee_id: number;
  public value: number;
  public status?: PaymentStatus;
  public date?: Date;
}

export enum PaymentStatus {
  waiting = 'waiting',
  confirmed = 'confirmed',
  canceled = 'canceled'
}
