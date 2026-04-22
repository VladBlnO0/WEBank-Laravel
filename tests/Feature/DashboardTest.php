<?php


test('', function () {
  $response = $this->get('/test');

  $response->assertStatus(200);
});
