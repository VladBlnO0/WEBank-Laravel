<?php

namespace App\Enums;

enum TransactionType: string
{
    case PAYMENT = 'payment';
    case TRANSFER = 'transfer';
}
