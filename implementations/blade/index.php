<?php

// Check if vendor autoload exists
if (file_exists(__DIR__ . '/vendor/autoload.php')) {
    require __DIR__ . '/vendor/autoload.php';
} else {
    die('Please run "composer install" in implementations/blade directory.');
}

use Illuminate\Container\Container;
use Illuminate\Events\Dispatcher;
use Illuminate\Filesystem\Filesystem;
use Illuminate\View\Compilers\BladeCompiler;
use Illuminate\View\Engines\CompilerEngine;
use Illuminate\View\Engines\EngineResolver;
use Illuminate\View\Factory;
use Illuminate\View\FileViewFinder;

// Configuration
$viewsPath = __DIR__ . '/views';
$cachePath = __DIR__ . '/cache';

// Ensure cache directory exists
if (!file_exists($cachePath)) {
    mkdir($cachePath, 0755, true);
}

// Dependencies
$filesystem = new Filesystem;
$eventDispatcher = new Dispatcher(new Container);

// View Factory Setup
$viewResolver = new EngineResolver;
$bladeCompiler = new BladeCompiler($filesystem, $cachePath);

$viewResolver->register('blade', function () use ($bladeCompiler) {
    return new CompilerEngine($bladeCompiler);
});

$viewFinder = new FileViewFinder($filesystem, [$viewsPath]);
$viewFactory = new Factory($viewResolver, $viewFinder, $eventDispatcher);

// Generate initial todos
$todos = [];
for ($i = 1; $i <= 100; $i++) {
    $todos[] = [
        'id' => $i,
        'text' => "Todo item $i",
        'completed' => $i % 3 === 0,
    ];
}

// Render
echo $viewFactory->make('index', ['todos' => $todos])->render();
