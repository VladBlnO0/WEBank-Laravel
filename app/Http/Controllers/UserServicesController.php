<?php

namespace App\Http\Controllers;

class UserServicesController extends Controller
{
    public function index()
    {
        return inertia('User/UserServices');
    }

    public function show()
    {
        return inertia('User/UserServices');
    }
}
