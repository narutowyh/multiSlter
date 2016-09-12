<?php
apf_require_class('APF_Component');
class User_Touch_Module_MultiSlterComponent extends APF_Component {
    public function get_view () {
        return "MultiSlter";
    }

    public static function use_javascripts() {
        return array_merge(
                parent::use_javascripts(),
                array(
                    User_Touch_Util_PageHelper::pure_static_url('/js/iscroll/5.2.0/iscroll-lite.js')
                )
            )
        ;
    }

    public static function use_boundable_javascripts() {
        $path = apf_classname_to_path(__CLASS__);
        return array_merge(
            parent::use_boundable_javascripts(),
            array($path . "MultiSlter.js")
        );
    }

    public static function use_boundable_styles() {
        $path = apf_classname_to_path(__CLASS__);
        return array_merge(
            parent::use_boundable_styles(),
            array($path . "MultiSlter.css")
        );
    }

}
