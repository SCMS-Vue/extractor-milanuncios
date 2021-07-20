<?php
namespace App;
use Laminas\Diactoros\Response\JsonResponse;
use Helpers\Help;
use Spatie\Async\Pool;
use \ZipArchive as ZipArchive;

class LoopController {
    static $url;
    static $images;

    public static function handle($url) {
        self::$url = Help::decode($url);
        $item = explode('-', self::$url);
        $dir = '';
        $zipdir = '';

        if(count($item)) {
            $item = end($item);
            $item = (int) filter_var($item, FILTER_SANITIZE_NUMBER_INT);
            $dir = dirname(__DIR__, 1) . DIRECTORY_SEPARATOR . "images" . DIRECTORY_SEPARATOR . $item . DIRECTORY_SEPARATOR;
            $zipdir = dirname(__DIR__, 1) . DIRECTORY_SEPARATOR . "images" . DIRECTORY_SEPARATOR . $item . '.zip';
            
            if (!file_exists($dir)) {
                mkdir($dir, 0777, true);
            }
        } else {
            return "";
        }

        self::$images = Help::getimages(self::$url);

        foreach(self::$images as $image) {
            $finfo = pathinfo($image);
            if (!file_exists($dir . $finfo['basename'])) {
                Help::download($image, $dir . $finfo['basename']);
            }
        }

        

        if (!file_exists($zipdir)) {
            $zip = new ZipArchive;
            $zip->open($zipdir, ZipArchive::CREATE);
            foreach (glob($dir . "*") as $file) {
                $finfo = pathinfo($file);
                $zip->addFile($file, $finfo['basename']);
            }
            $zip->close();
        }
        
        $response = [
            "item" => $item,
            "images" => self::$images,
            "archive" => $zipdir
        ];
        
        return new JsonResponse($response, 200);
        
    }
}