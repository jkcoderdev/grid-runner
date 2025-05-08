<?php

// Redirect if logged in
if (isset($_SESSION['user_id'])) {
    redirect('/');
}

// Validate data
if (isset($_POST['username']) && isset($_POST['password']) && !empty($_POST['username']) && !empty($_POST['password'])) {
    $username = $_POST['username'];
    $password = $_POST['password'];

    // Get user from database
    $sql = "SELECT * FROM users WHERE username = ?";
    $stmt = $db->prepare($sql);
    $stmt->execute([$username]);

    if ($stmt->rowCount() == 1) {
        // Get user password hash
        $user = $stmt->fetch();
        $password_hash = $user['password'];

        // Verify password
        if (password_verify($password, $password_hash)) {
            // Login
            $_SESSION['user_id'] = $user['id'];

            redirect('/');
        } else {
            $_SESSION['form_error'] = 'Username or password is incorrect';
        }
    } else {
        $_SESSION['form_error'] = 'Username or password is incorrect';
    }
} else {
    $_SESSION['form_error'] = 'Every field must be filled';
}

redirect('/login');
