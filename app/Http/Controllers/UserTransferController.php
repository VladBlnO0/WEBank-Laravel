<?php

namespace App\Http\Controllers;

class UserTransferController extends Controller
{
    public function index()
    {
      return inertia('User/UserTransfer');

    } public function show()
    {
        return inertia('User/UserTransfer');
    }
}
