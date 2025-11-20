package com.ZzicGo.global.s3;

import com.amazonaws.HttpMethod;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.GeneratePresignedUrlRequest;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Date;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class S3Uploader {

    private final AmazonS3 amazonS3;

    @Value("${cloud.aws.s3.bucket}")
    private String bucketName;

    public String uploadFile(String dirName, MultipartFile file) {
        String fileName = dirName + "/" + UUID.randomUUID() + "_" + file.getOriginalFilename();

        try {
            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentType(file.getContentType());
            metadata.setContentLength(file.getSize());

            // ACL 제거
            amazonS3.putObject(
                    new PutObjectRequest(bucketName, fileName, file.getInputStream(), metadata)
            );

            // ⭐ 여기! → key만 반환해야 함
            return fileName;

        } catch (IOException e) {
            throw new RuntimeException("S3 업로드 실패", e);
        }
    }

    public String getPresignedUrl(String key) {
        Date expiration = new Date(System.currentTimeMillis() + 1000L * 60 * 30); // 3분 유효

        GeneratePresignedUrlRequest request =
                new GeneratePresignedUrlRequest(bucketName, key)
                        .withMethod(HttpMethod.GET)
                        .withExpiration(expiration);

        return amazonS3.generatePresignedUrl(request).toString();
    }

    public void deleteFile(String key) {
        amazonS3.deleteObject(bucketName, key);
    }
}
