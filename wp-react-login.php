<?php

require_once('wp-load.php');
$response = array(
    'data'        => array(),
    'msg'        => 'Invalid email or password',
    'status'    => false
);

/* Sanitize POST */
foreach ($_POST as $k => $value) {
    $_POST[$k] = sanitize_text_field($value);
}
header('Content-type: application/json');

/**
 * Login
 *
 */
if (isset($_POST['type']) &&  $_POST['type'] == 'login') {
    // Get user 
    $user = get_user_by('email', $_POST['email']);
    if ($user) {
        $password_check = wp_check_password($_POST['password'], $user->user_pass, $user->ID);
        if ($password_check) {
            update_user_meta($user->ID, 'push_token', $_POST['push_token']);
            // Generate token - MUST BE IMPROVED
            $token = md5(uniqid());
            // Save token as a meta for user
            if (update_user_meta($user->ID, 'auth_token', $token)) {
                $response['avatar'] = get_avatar_url($user->ID);
                //Build the response object
                $response['status'] = true;
                $response['data'] = array(
                    'auth_token'     =>    $token,
                    'user_id'        =>    $user->ID,
                    'user_login'    =>    $user->user_login
                );
                $response['msg'] = 'Successfully Authenticated';
                $response['token'] = $token;
            }
        }
    }
}
//send the response
echo json_encode($response);
