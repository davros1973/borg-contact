<?php
    session_start();
    /* February 2017, David Bayliss
       Super simple check to help prevent scraping
       Generate uniqueid for session (might expand later)
       provide to ajax client on request,
       and provide contact details if uniqueid presented
       TODO: RESTful version

       nb: css for <li> icons set in my WordPress Additional CSS
       Also see: 
       https://blog.xarta.co.uk/2017/02/making-the-fancy-font/
        
        e.g.
        
        ul.icon { list-style-type: none; }
        ul.icon li { text-indent: -1.4em; }

        ul.icon li:before
        {
            font-family: 'xarta' !important;
            content: "\e800";
            float: left;
            width: 1.4em
        }

        ul.icon li.github:before { content: "\EAB0"; }
        ul.icon li.linkedin:before { content: "\EAC9"; }
        ul.icon li.email:before { content: "\EA83"; }
        ul.icon li.phone:before { content: "\E959"; }
        ul.icon li.address:before { content: "\E903"; }
        ul.icon li.website:before { content: "\E902"; }
        ul.icon li.name:before { content: "\EAC0"; }

    */

   if (!isset($_SESSION['authentication']))
   {
       $_SESSION['authentication'] = uniqid();
   }

   // I've done this - this way for now ... but need to checkout
   // readfile() ... which I think will be a better fit
   // (I think it's more readable this way)

   $errormsg = 'Error 404';
   $name = $errormsg;
   $github = $errormsg;
   $linkedin = $errormsg;
   $email = $errormsg;
   $phone = $errormsg;
   $address = $errormsg;
   $website = $errormsg;

   // NOT SURE IF $_SERVER[DOCUMENT_ROOT] ALWAYS AVAILABLE?
      $includepath = "$_SERVER[DOCUMENT_ROOT]/xarta/xprotected/contactdetails.php";

   // ASSUMING /xprotected is a subdirectory to where this file is:
   // $includepath = dirname(__FILE__)."/xprotected/contactdetails.php";
   
   // set $name, $github etc. with real values
   include ($includepath);
?> 
<?php if($_POST['authentication'] == 'getcode'): ?>
<?php echo($_SESSION['authentication']); ?>   
<?php elseif(trim(strval($_POST['authentication'])) === trim(strval($_SESSION['authentication']))): ?>
<ul class='icon'>
    <li class='name'><?php echo $name ?></li>
    <li class='github'><?php echo $github ?></li>
    <li class='linkedin'><?php echo $linkedin ?></li>
    <li class='email'><?php echo $email ?></li>
    <li class='phone'><?php echo $phone ?></li>
    <li class='address'><?php echo $address ?></li>
    <li class='website'><?php echo $website ?></li>
</ul>
<br /><br />
<div>
<form action=<?php echo ('"/'.basename(__FILE__).'"') ?> method='post'>
    <fieldset>
        <legend>TESTING, TESTING:</legend>
        <input type='button' value='RE-RUN VIDEO' onClick='refresh()'>
    </fieldset>
</form>
</div>
<br /><br />
<?php else: ?>
    <p>OOPS - NOT AUTHENTICATED</p>
    <?php echo (trim(strval($_POST['authentication']))); ?>
    <?php echo (trim(strval($_SESSION['authentication']))); ?>
<?php endif; ?>