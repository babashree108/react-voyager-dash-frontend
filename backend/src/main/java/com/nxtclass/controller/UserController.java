package com.nxtclass.controller;

import com.nxtclass.dto.UserDto;
import com.nxtclass.entity.UserRole;
import com.nxtclass.entity.User;
import com.nxtclass.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

	private final UserRepository userRepository;

	private UserDto toDto(User user) {
		UserDto dto = new UserDto();
		dto.setId(user.getId());
		dto.setName(user.getName());
		dto.setEmail(user.getEmail());
		dto.setPassword(user.getPassword());
		dto.setRole(user.getRole());
		dto.setStatus(user.getStatus());
		dto.setAvatarUrl(user.getAvatarUrl());
		dto.setOrganization(user.getOrganization());
		dto.setCreatedAt(user.getCreatedAt());
		dto.setUpdatedAt(user.getUpdatedAt());
		return dto;
	}

	private void applyDto(UserDto dto, User user) {
		user.setName(dto.getName());
		user.setEmail(dto.getEmail());
		user.setPassword(dto.getPassword());
		user.setRole(dto.getRole());
		if (dto.getStatus() != null) user.setStatus(dto.getStatus());
		user.setAvatarUrl(dto.getAvatarUrl());
		user.setOrganization(dto.getOrganization());
	}

	@GetMapping("list")
	public ResponseEntity<List<UserDto>> list() {
		List<UserDto> users = userRepository.findAll().stream()
				.map(this::toDto)
				.collect(Collectors.toList());
		return ResponseEntity.ok(users);
	}

	@GetMapping("count")
	public ResponseEntity<Long> count() {
		return ResponseEntity.ok(userRepository.countAllUsers());
	}

	@GetMapping("/{id}")
	public ResponseEntity<UserDto> get(@PathVariable Long id) {
		return userRepository.findById(id)
				.map(user -> ResponseEntity.ok(toDto(user)))
				.orElse(ResponseEntity.notFound().build());
	}

	@GetMapping("by-role/{role}")
	public ResponseEntity<List<UserDto>> listByRole(@PathVariable UserRole role) {
		List<UserDto> users = userRepository.findByRole(role).stream()
				.map(this::toDto)
				.collect(Collectors.toList());
		return ResponseEntity.ok(users);
	}

	@PostMapping("save")
	public ResponseEntity<?> save(@Valid @RequestBody UserDto dto) {
		// Basic unique email check
		if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
			return ResponseEntity.status(HttpStatus.CONFLICT)
					.body("Email already exists");
		}
		User user = new User();
		applyDto(dto, user);
		User saved = userRepository.save(user);
		return ResponseEntity.ok(saved.getId());
	}

	@PutMapping("update")
	public ResponseEntity<?> update(@Valid @RequestBody UserDto dto) {
		if (dto.getId() == null) {
			return ResponseEntity.badRequest().body("Id is required for update.");
		}
		Optional<User> existingOpt = userRepository.findById(dto.getId());
		if (existingOpt.isEmpty()) {
			return ResponseEntity.notFound().build();
		}
		User existing = existingOpt.get();
		// If email is changing, ensure it's still unique
		if (!existing.getEmail().equals(dto.getEmail()) && userRepository.findByEmail(dto.getEmail()).isPresent()) {
			return ResponseEntity.status(HttpStatus.CONFLICT)
					.body("Email already exists");
		}
		applyDto(dto, existing);
		User saved = userRepository.save(existing);
		return ResponseEntity.ok(toDto(saved));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<?> delete(@PathVariable Long id) {
		if (!userRepository.existsById(id)) {
			return ResponseEntity.notFound().build();
		}
		userRepository.deleteById(id);
		return ResponseEntity.ok("success");
	}

}