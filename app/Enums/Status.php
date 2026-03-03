<?php

namespace App\Enums;

enum Status: string
{
    case ACTIVE = 'active';
    case BLOCKER = 'blocked';
    case INACTIVE = 'inactive';
}
