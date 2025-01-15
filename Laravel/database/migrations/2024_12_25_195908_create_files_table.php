<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFilesTable extends Migration
{
    public function up()
    {
        Schema::create('files', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('fileable_id');
            $table->string('fileable_type');
            $table->string('name');
            $table->string('file_path'); // Path to the uploaded file
            $table->unsignedBigInteger('uploaded_by'); // User who uploaded the file
            $table->integer('size')->nullable(); // Size of the uploaded file in bytes
            $table->string('icon')->nullable(); // Icon representing the file type
            $table->string('type')->nullable(); // Type of the file (e.g., 'image/jpeg', 'application/pdf')
            $table->timestamps();
            
            $table->foreign('uploaded_by')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('files');
    }
}
