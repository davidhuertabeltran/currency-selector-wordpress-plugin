<?php

/*
    Plugin Name: Currency Ratio Recruitment Plugin
    Description: Wordpress plugin that renders current currency ratio using open NBP API
    Version: 1.0
    Author: David Huerta Beltran
    Author URI: https://github.com/davidhuertabeltran
*/

if( ! defined ( 'ABSPATH' ) ) exit; 

class CurrencyRecruitmentTaskDavid {
    function __construct() {
        add_action('init', array($this, 'adminAssetsPlugin'));
    }

    function adminAssetsPlugin() {
        wp_register_style('currencyeditcss', plugin_dir_url(__FILE__) . 'build/index.css');
        wp_register_script('currencyblocktype', plugin_dir_url(__FILE__) . 'build/index.js', array('wp-blocks', 'wp-element', 'wp-editor'));
        register_block_type('myplugin/currency-selector-david', array(
            'editor_script' => 'currencyblocktype',
            'editor_style' => 'currencyeditcss',
            'render_callback' => array($this, 'htmlDisplayInfo')
        ));
    }

    function htmlDisplayInfo($attributes) {
        if(!is_admin()) {
            wp_enqueue_script('currencyFrontend', plugin_dir_url(__FILE__) . 'build/currencyBlock.js', array('wp-element'));
            wp_enqueue_style('currencyFrontendStyle', plugin_dir_url(__FILE__) . 'build/currencyBlock.css');
        }
        
        ob_start(); ?>
        <div class="currency-plugin-container">
            <pre style="display: none"><?php echo wp_json_encode($attributes); ?></pre>
        </div>
        <?php return ob_get_clean();

    }
}

$currencyRecruitmentTaskDavid = new CurrencyRecruitmentTaskDavid();