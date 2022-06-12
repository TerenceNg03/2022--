package zju.se.management.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name="APILog")
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class APILog {

    @Id
    @Column
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column
    private String className;

    @Column
    private String methodName;

    @Column
    private String URI;

    @Column
    private String status;

    @Column
    private double executionTime;

    @Temporal(TemporalType.TIMESTAMP)
    @Column
    private Date time;
}
