<?php

// Redirect if logged in
if (isset($_SESSION['user_id'])) {
    redirect('/');
}

// Validate data
if (isset($_POST['username']) && isset($_POST['password']) && isset($_POST['repeat_password']) && !empty($_POST['username']) && !empty($_POST['password']) && !empty($_POST['repeat_password'])) {
    $username = $_POST['username'];
    $password = $_POST['password'];
    $repeat_password = $_POST['repeat_password'];
    
    $username_pattern = '/^[a-zA-Z0-9]+$/';
    $password_identity = $password == $repeat_password;

    // Check if username length is correct
    if (strlen($username) >= 4 && strlen($username) <= 20) {
        // Check if password length is correct
        if (strlen($password) >= 8 && strlen($password) <= 20) {
            // Check if username pattern passes the test
            if (preg_match($username_pattern, $username)) {
                // Check if password identity passes the test
                if ($password_identity) {
                    // Check if username is already taken
                    $sql = "SELECT * FROM users WHERE username = ?";
                    $stmt = $db->prepare($sql);
                    $stmt->execute([$username]);

                    // Check number of rows
                    if ($stmt->rowCount() == 0) {
                        unset($stmt);

                        $password_hash = password_hash($password, PASSWORD_DEFAULT);

                        // Add user to database'
                        $sql = "INSERT INTO users (username, password) VALUES (?, ?)";
                        $stmt = $db->prepare($sql);
                        $stmt->execute([$username, $password_hash]);

                        unset($stmt);

                        // Redirect to login page
                        redirect('/login');
                    } else {
                        $_SESSION['form_error'] = 'Username already taken';
                    }
                } else {
                    $_SESSION['form_error'] = 'Passwords do not match';
                }
            } else {
                $_SESSION['form_error'] = 'Username must contain only letters and numbers';
            }
        } else {
            $_SESSION['form_error'] = 'Password must be between 8 and 20 characters';
        }
    } else {
        $_SESSION['form_error'] = 'Username must be between 4 and 20 characters';
    }
} else {
    $_SESSION['form_error'] = 'Every field must be filled';
}

redirect('/signup');
