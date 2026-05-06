<?php
// submit.php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // 1. Get Form Data
    $name = strip_tags(trim($_POST["name"]));
    $phone = strip_tags(trim($_POST["phone"]));
    $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    $source = strip_tags(trim($_POST["source"]));

    // 2. Validate Data
    if (empty($name) || empty($phone) || empty($email)) {
        echo "<script>alert('Please fill all required fields.'); window.history.back();</script>";
        exit;
    }

    // 3. Email Settings
    // IMPORTANT: Change this to the email address where you want to receive leads
    $recipient = "sales@dsrprojects.co.in"; 
    $subject = "New Lead from DSR Landing Page - $source";

    // 4. Email Content
    $email_content = "You have received a new lead from the DSR Landing Page.\n\n";
    $email_content .= "Source: $source\n";
    $email_content .= "Name: $name\n";
    $email_content .= "Phone: $phone\n";
    $email_content .= "Email: $email\n";

    // 5. Email Headers
    // IMPORTANT: The 'From' address must be an active email account on your Hostinger hosting
    $headers = "From: leads@dsrprojects.co.in\r\n";
    $headers .= "Reply-To: $email\r\n";
    
    // 6. Log to CSV
    $csv_file = 'leads.csv';
    $timestamp = date("Y-m-d H:i:s");
    $file_exists = file_exists($csv_file);
    
    $file_handle = fopen($csv_file, 'a');
    
    // If file is new, add header row
    if (!$file_exists) {
        fputcsv($file_handle, ['Timestamp', 'Source', 'Name', 'Phone', 'Email']);
    }
    
    // Add lead data
    fputcsv($file_handle, [$timestamp, $source, $name, $phone, $email]);
    fclose($file_handle);
    
    // 7. Send the Email
    if (mail($recipient, $subject, $email_content, $headers)) {
        // Success: Alert the user and redirect back to the home page
        echo "<script>alert('Thank you! Your details have been submitted successfully. Our property experts will contact you soon.'); window.location.href = 'index.html';</script>";
    } else {
        // Fallback: If mail fails, check if CSV was at least written
        if ($file_exists || file_exists($csv_file)) {
             echo "<script>alert('Thank you! Your details have been recorded. Our team will contact you soon.'); window.location.href = 'index.html';</script>";
        } else {
             echo "<script>alert('Oops! Something went wrong. Please try again later.'); window.history.back();</script>";
        }
    }
} else {
    // Not a POST request
    header("Location: index.html");
    exit;
}
?>
